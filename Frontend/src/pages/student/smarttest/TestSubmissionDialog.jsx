import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

export const TestSubmissionDialog = ({
    open,
    onOpenChange,
    attemptId,
    testId
}) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Test Submitted Successfully!</DialogTitle>
                    <DialogDescription>
                        Your answers have been recorded and AI feedback is being generated.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            navigate(`/test`);
                        }}
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={async () => {
                            const { data } = await getResults({ attemptId }).unwrap();
                            navigate(`/test-attempts/${attemptId}/results`, {
                                state: { submissionData: data }
                            });
                        }}
                    >
                        View Results
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};