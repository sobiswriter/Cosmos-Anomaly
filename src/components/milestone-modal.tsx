'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  narrative: string;
}

export default function MilestoneModal({
  isOpen,
  onClose,
  imageUrl,
  narrative,
}: MilestoneModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card/80 backdrop-blur-lg border-amber/50 text-foreground p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-headline text-amber drop-shadow-amber">
            Milestone Event
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            A critical juncture has been recorded.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-md border border-secondary">
              {imageUrl && (
                <motion.div
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  transition={{ duration: 10, ease: 'easeOut' }}
                  className="w-full h-full"
                >
                  <Image
                    src={imageUrl}
                    alt={narrative}
                    width={1280}
                    height={720}
                    className="object-cover w-full h-full"
                    data-ai-hint="historical event"
                  />
                </motion.div>
              )}
            </div>
          <p className="text-center text-lg">{narrative}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
