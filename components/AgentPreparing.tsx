import { Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface AgentPreparingProps {
    message: string;
}

export default function AgentPreparing({ message }: AgentPreparingProps) {
    return (
        <div className="w-full h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardContent className="flex flex-col items-center text-center gap-6 p-8">
                    <div className="relative">
                        <div className="relative flex items-center justify-center">
                            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                        <div className="absolute -inset-4">
                            <div className="h-20 w-20 rounded-full border-2 border-primary/20 animate-ping"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Almost Ready!</h3>
                        <p className="text-muted-foreground">{message}</p>
                    </div>

                    <div className="w-full space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">Registration completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-foreground">Preparing your agent</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
