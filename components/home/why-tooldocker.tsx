'use client';

import type { ElementType } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, ClipboardList, Zap } from 'lucide-react';
import Image from 'next/image';

interface FeatureCard {
    type: 'feature';
    icon: ElementType;
    title: string;
    description: string;
}

interface ImageCard {
    type: 'image';
    src: string;
    alt: string;
    span?: string;
}

type CardData = FeatureCard | ImageCard;

const cardData: CardData[] = [
    {
        type: 'feature',
        icon: ShieldCheck,
        title: 'Quality assured products',
        description: 'Every product is verified for quality so buyers get reliable tools machinery and supplies for their projects',
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        alt: 'Industrial warehouse',
        span: 'sm:row-span-2',
    },
    {
        type: 'feature',
        icon: Search,
        title: 'Built for product discovery',
        description: 'Category browsing search and filters organized for contractors and industrial procurement teams',
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80',
        alt: 'Construction workers',
    },
    {
        type: 'feature',
        icon: ClipboardList,
        title: 'Bulk ordering made easy',
        description: 'Order in bulk with clear pricing stock availability and GST invoicing for business buyers',
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
        alt: 'Welding equipment',
        span: 'sm:row-span-2',
    },
    {
        type: 'feature',
        icon: Zap,
        title: 'Smart search that works',
        description: 'Find products faster with intelligent search that understands industrial terms and categories',
    },
];

export function WhyTooldocker() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-semibold tracking-tight text-black md:text-4xl"
                    >
                        Why Tooldocker is the best place to buy industrial products.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-base leading-7 text-stone-500"
                    >
                        Quality products clear categories fast search and a buying experience built for contractors and procurement teams.
                    </motion.p>
                </div>

                {/* Bento grid */}
                <div className="mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 auto-rows-[180px]">
                    {cardData.map((card, idx) => {
                        if (card.type === 'feature') {
                            const IconComponent = card.icon as ElementType;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group flex flex-col justify-center rounded-2xl bg-[#c7112c] p-5 sm:p-6 transition-all hover:shadow-xl hover:shadow-[#c7112c]/20 hover:-translate-y-1"
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:mb-4 sm:h-11 sm:w-11">
                                        <IconComponent className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="mb-1.5 text-sm font-semibold tracking-tight text-white sm:text-base">{card.title}</h3>
                                    <p className="text-xs leading-5 text-white/80 sm:text-sm">{card.description}</p>
                                </motion.div>
                            );
                        }

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className={`relative overflow-hidden rounded-2xl ${card.span || ''}`}
                            >
                                <Image
                                    src={card.src}
                                    alt={card.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
