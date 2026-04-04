"use client";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "This platform transformed how we create images. The AI-powered generation is incredibly fast and produces stunning results every time.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "Creative Director",
  },
  {
    text: "The ease of use is remarkable. Within minutes, I was generating professional-quality images for our marketing campaigns.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus Johnson",
    role: "Marketing Manager",
  },
  {
    text: "Outstanding support and continuous improvements. This tool has become essential for our design workflow.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Rodriguez",
    role: "Product Designer",
  },
  {
    text: "The quality and speed of image generation exceeded all expectations. Highly recommend for any creative professional.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Kim",
    role: "CEO",
  },
  {
    text: "Game-changing technology that saves us hours of work. The results are consistently impressive.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Jessica Taylor",
    role: "Art Director",
  },
  {
    text: "Simple, powerful, and reliable. This platform delivers exactly what we need for our visual content.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Amanda Foster",
    role: "Content Strategist",
  },
  {
    text: "The intuitive interface and powerful features make image creation effortless. Our team loves it.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Ryan Mitchell",
    role: "Brand Manager",
  },
  {
    text: "Exceptional quality and versatility. This tool adapts perfectly to our diverse creative needs.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Lisa Anderson",
    role: "Creative Lead",
  },
  {
    text: "Our conversion rates improved significantly with the high-quality visuals we create using this platform.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "James Wilson",
    role: "Growth Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;