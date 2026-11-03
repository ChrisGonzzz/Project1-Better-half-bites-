"use client";

import { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { supabase } from "../lib/supabase";

const dummyRestaurants = [
  { id: "rest-1", name: "Joe's Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" },
  { id: "rest-2", name: "Spicy Thai", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80" },
  { id: "rest-3", name: "Burger Joint", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" }
];

const SESSION_ID = "test-session-123";

export default function Home() {
  const [lastDirection, setLastDirection] = useState();
  const [match, setMatch] = useState(null);
  const [myUserId, setMyUserId] = useState("");

  // 1. Generate the random ID safely on the client side
  useEffect(() => {
    setMyUserId(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    if (!myUserId) return; // Wait until ID is generated

    const channel = supabase
      .channel(`room-${SESSION_ID}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'swipes', filter: `session_id=eq.${SESSION_ID}` },
        async (payload) => {
          const newSwipe = payload.new;
          if (newSwipe.user_id !== myUserId && newSwipe.is_right_swipe) {
            const { data } = await supabase
              .from('swipes')
              .select('*')
              .eq('session_id', SESSION_ID)
              .eq('user_id', myUserId)
              .eq('restaurant_id', newSwipe.restaurant_id)
              .eq('is_right_swipe', true)
              .single();
              
            if (data) {
              const matchedRestaurant = dummyRestaurants.find(r => r.id === newSwipe.restaurant_id);
              setMatch(matchedRestaurant);
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [myUserId]);

  const swiped = async (direction, restaurant) => {
    setLastDirection(direction);
    if (!myUserId) return;

    const isRightSwipe = direction === "right";
    const { error } = await supabase.from("swipes").insert({
      session_id: SESSION_ID,
      user_id: myUserId,
      restaurant_id: restaurant.id,
      is_right_swipe: isRightSwipe
    });

    if (error) console.error("Error saving swipe:", error.message);
  };

  if (match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-5xl font-extrabold text-green-600 mb-4">🎉 IT'S A MATCH! 🎉</h1>
        <h2 className="text-3xl font-bold text-gray-800">You both want {match.name}!</h2>
        <div 
          style={{ backgroundImage: `url(${match.image})` }}
          className="w-64 h-64 bg-cover bg-center rounded-full shadow-2xl mt-8 border-4 border-green-500"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dinner Match</h1>
      <div className="relative w-80 h-[400px]">
        {dummyRestaurants.map((restaurant) => (
          <TinderCard
            className="absolute w-full h-full cursor-grab active:cursor-grabbing"
            key={restaurant.id}
            onSwipe={(dir) => swiped(dir, restaurant)}
            preventSwipe={['up', 'down']}
          >
            <div
              style={{ backgroundImage: `url(${restaurant.image})` }}
              className="w-full h-full bg-cover bg-center rounded-2xl shadow-xl flex items-end p-6 border border-gray-200"
            >
              <h2 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
                {restaurant.name}
              </h2>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="mt-8 h-8">
        {lastDirection ? (
          <h2 className="text-xl font-semibold text-gray-600">You swiped {lastDirection}!</h2>
        ) : (
          <h2 className="text-xl font-semibold text-gray-400">Swipe left for No, right for Yes</h2>
        )}
      </div>
    </div>
  );
}