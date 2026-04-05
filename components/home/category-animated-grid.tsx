'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

type Category = {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    description?: string | null;
};

const categoryCopy: Record<string, { eyebrow: string; description: string; accent: string }> = {
    'power-tools': {
        eyebrow: 'High demand',
        description: 'Drills, grinders, cutters, breakers, and fast-moving jobsite tools for daily professional use.',
        accent: 'from-orange-100 via-amber-50 to-white',
    },
    'hand-tools': {
        eyebrow: 'Workshop core',
        description: 'Reliable measuring, fastening, gripping, striking, and finishing tools for technicians and fitters.',
        accent: 'from-slate-100 via-stone-50 to-white',
    },
    'construction-equipment': {
        eyebrow: 'Project sites',
        description: 'Concrete, compaction, lifting, and heavy-duty site equipment for builders and contractors.',
        accent: 'from-amber-100 via-orange-50 to-white',
    },
    machinery: {
        eyebrow: 'Heavy purchase',
        description: 'Production-ready industrial machinery for fabrication, processing, workshop expansion, and plant use.',
        accent: 'from-zinc-100 via-stone-50 to-white',
    },
    'safety-equipment': {
        eyebrow: 'Compliance',
        description: 'Helmets, gloves, shoes, goggles, and PPE essentials for safer work across demanding environments.',
        accent: 'from-emerald-100 via-lime-50 to-white',
    },
    welding: {
        eyebrow: 'Fabrication',
        description: 'Welding machines, torches, consumables, and accessories for shop-floor and site fabrication jobs.',
        accent: 'from-rose-100 via-orange-50 to-white',
    },
    electrical: {
        eyebrow: 'Infrastructure',
        description: 'Cables, testers, panels, fittings, and electrical install supplies for maintenance and projects.',
        accent: 'from-sky-100 via-cyan-50 to-white',
    },
    plumbing: {
        eyebrow: 'Utilities',
        description: 'Pipes, fittings, pumps, valves, sealing products, and plumbing tools for new and retrofit work.',
        accent: 'from-cyan-100 via-sky-50 to-white',
    },
    hardware: {
        eyebrow: 'Daily use',
        description: 'Fasteners, locks, hinges, anchors, and practical hardware used across repair and installation work.',
        accent: 'from-stone-100 via-neutral-50 to-white',
    },
    fasteners: {
        eyebrow: 'Bulk supply',
        description: 'Nuts, bolts, washers, anchors, and fixings sorted for repeat procurement and project consumption.',
        accent: 'from-neutral-100 via-stone-50 to-white',
    },
    abrasives: {
        eyebrow: 'Cut and finish',
        description: 'Grinding wheels, cutting discs, sanders, and finishing consumables for metal and surface prep.',
        accent: 'from-red-100 via-orange-50 to-white',
    },
    painting: {
        eyebrow: 'Surface work',
        description: 'Sprayers, rollers, masking, finishing, and coating tools for project delivery and maintenance teams.',
        accent: 'from-yellow-100 via-amber-50 to-white',
    },
    measurement: {
        eyebrow: 'Precision',
        description: 'Laser levels, tapes, gauges, and inspection tools for accurate installation, layout, and QA work.',
        accent: 'from-indigo-100 via-blue-50 to-white',
    },
};

function getCategoryContent(category: Category) {
    const normalizedSlug = category.slug.toLowerCase();
    const normalizedName = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const matchedKey = Object.keys(categoryCopy).find((key) =>
        normalizedSlug.includes(key) || normalizedName.includes(key)
    );

    return matchedKey
        ? categoryCopy[matchedKey]
        : {
            eyebrow: 'Industrial range',
            description: category.description || `Explore ${category.name.toLowerCase()} selected for industrial buyers, contractors, and growing businesses.`,
            accent: 'from-orange-50 via-stone-50 to-white',
        };
}

export function CategoryAnimatedGrid({ categories }: { categories: Category[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category, index) => {
                const content = getCategoryContent(category);

                return (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
                    whileHover={{ y: -5 }}
                >
                    <Link
                        href={`/category/${category.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,0.28)]"
                    >
                        <div className={`relative h-28 w-full overflow-hidden bg-gradient-to-br ${content.accent}`}>
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col justify-between p-4">
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{content.eyebrow}</div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_20%,rgba(15,23,42,0.12)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="relative flex flex-1 flex-col p-4">
                            <h3 className="text-sm font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-primary leading-snug">{category.name}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{content.description}</p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-400">{content.eyebrow}</div>
                                <div className="text-xs font-medium text-orange-600 transition-transform duration-300 group-hover:translate-x-0.5">Explore</div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
                );
            })}
        </div>
    );
}
