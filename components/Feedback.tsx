'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';

export default function Feedback() {
    const [comment, setComment] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedbackSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await AxiosInstance.post(
                '/api/v1/feedback',
                {
                    comment,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.data.success === true) {
                toast(response.data.message);
                setOpen((prevOpen) => !prevOpen);
                setComment('');
            }
        } catch (err) {
            const error = err as AxiosError;
            if (error.response) {
                throw new Error(
                    (error.response.data as AxiosError)?.message || 'Failed to submit feedback. Please try again',
                );
            } else if (error.request) {
                throw new Error('No response from server. Check your network.');
            } else {
                throw new Error('Unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="hidden sm:block cursor-pointer border border-neutral-300 dark:border-neutral-800"
                >
                    Feedback{' '}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[520px] w-full border border-neutral-300 dark:border-neutral-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-hidden">
                    <DialogHeader className="space-y-4 pb-6 border-b border-neutral-300 dark:border-neutral-800">
                        <DialogTitle className="mt-4 text-center text-2xl font-bold">Share Your Feedback</DialogTitle>
                        <DialogDescription className="text-center max-w-sm mx-auto leading-relaxed">
                            Your insights help us build a better experience for everyone. Every suggestion matters!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="space-y-3">
                            <Label htmlFor="feedback-comment" className="text-sm font-semibold">
                                Your Feedback
                            </Label>
                            <div className="relative">
                                <Textarea
                                    id="feedback-comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What's on your mind? Share your thoughts, suggestions, or any issues you've encountered..."
                                    className="w-full resize-none min-h-[140px] text-sm border border-neutral-300 dark:border-neutral-800 rounded-md outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 active:ring-0"
                                    disabled={isSubmitting}
                                    maxLength={500}
                                />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span>We read every piece of feedback</span>
                                <div className="flex items-center gap-1">
                                    <span
                                        className={`font-medium transition-colors ${
                                            comment.length > 450
                                                ? 'text-red-500'
                                                : comment.length > 400
                                                  ? 'text-yellow-600'
                                                  : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                    >
                                        {comment.length}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-500">/500</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-3 pt-6 border-t border-neutral-300 dark:border-neutral-800">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleFeedbackSubmit}
                            disabled={isSubmitting || !comment.trim()}
                            className="flex-1 sm:flex-none gap-2 bg-neutral-800 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    <span>Send Feedback</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
