import { motion } from 'framer-motion';
import { Button } from './Button';

interface ThankYouStepProps {
  onFinish: () => void;
}

export function ThankYouStep({ onFinish }: ThankYouStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="card text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Thank You
          </h2>
          <p className="text-muted-foreground mb-4">
            Your responses have been recorded.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We will review your input and follow up as needed. Let's grow our community of practice together!
          </p>

          <Button onClick={onFinish} className="px-8 py-3">
            Finish
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
