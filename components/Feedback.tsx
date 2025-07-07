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
import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';

export default function Feedback() {
    const [comment, setComment] = useState<string | null>(null);
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
                throw new Error((error.response.data as AxiosError)?.message || 'Failed to submit feedback. Please try again');
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
                <Button variant="secondary" className='cursor-pointer'>Feedback </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Share Your Feedback
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Help us improve our platform by sharing your thoughts and suggestions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Feedback Textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback-comment" className="text-sm font-medium">
                            Your Feedback
                        </Label>
                        <Textarea
                            id="feedback-comment"
                            value={comment ?? ''}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you think about our platform. What's working well? What could be improved?"
                            className="resize-none min-h-[120px] text-sm break-all overflow-hidden"
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Your feedback helps us improve</span>
                            <span>{comment?.length ?? 0}/500</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFeedbackSubmit}
                        disabled={isSubmitting || !comment?.trim()}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Feedback
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
