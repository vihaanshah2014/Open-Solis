"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("Unlock your productivity potential.")
          .pauseFor(1200)
          .deleteAll()
          .typeString("Your AI-powered study companion.")
          .pauseFor(1500)
          .deleteAll()
          .typeString("Effortlessly capture and organize your notes.")
          .pauseFor(1800)
          .deleteAll()
          .typeString("Accelerate your learning journey.")
          .pauseFor(1200)
          .deleteAll()
          .typeString("Simplify your study life with AI.")
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
