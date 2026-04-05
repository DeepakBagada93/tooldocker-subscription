'use client';

import * as React from 'react';
import { X, Mail, Tag, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PromoPopup() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    React.useEffect(() => {
        // Check if the user has already seen or closed the popup
        const popupDismissed = localStorage.getItem('tooldocker_promo_dismissed');

        if (!popupDismissed) {
            // Show the popup after a 3-second delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Remember that the user closed the popup
        localStorage.setItem('tooldocker_promo_dismissed', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Here you would typically send the email to your API/newsletter service
            setIsSubmitted(true);

            // Auto-close after successful submission (after a short delay for them to see the success message)
            setTimeout(() => {
                handleClose();
            }, 3000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Popup Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4 sm:max-w-xl"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col sm:flex-row h-full">
                                {/* Image Section (Visible on tablet/desktop) */}
                                <div className="relative hidden w-2/5 overflow-hidden bg-primary sm:block">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 mix-blend-multiply" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <Tag className="h-32 w-32 text-white" />
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                                        <p className="font-heading text-4xl font-black italic tracking-tighter">SALE</p>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-8 sm:p-10">
                                    <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-primary/20">
                                        <Tag className="mr-1.5 h-3 w-3" />
                                        Special Offer
                                    </div>

                                    <h2 className="mb-3 font-heading text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                                        Get 10% Off Your First Order
                                    </h2>

                                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                                        Join our newsletter and receive a 10% discount code instantly. Plus, get exclusive access to industrial machinery sales and new arrivals.
                                    </p>

                                    {isSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="rounded-xl bg-green-50 p-6 text-center border border-green-100 dark:bg-green-950/30 dark:border-green-900/50"
                                        >
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="font-bold text-green-900 dark:text-green-300">You&apos;re on the list!</h3>
                                            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                                                Check your email for your 10% off code.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full h-12 text-base font-bold group">
                                                Unlock 10% Off
                                                <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                                                By subscribing, you agree to our Terms & Privacy Policy.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
}
