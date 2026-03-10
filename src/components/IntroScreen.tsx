import { motion } from 'framer-motion';
import { Button } from './Button';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            POD Finder
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover which area of contribution best matches your interests
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              About This Survey
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This survey helps you identify where you can make the most meaningful contribution.
              You'll rate your interest in different types of activities across four areas:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Grow Our Craft',
                description: 'Teaching, coaching, and building internal capability',
              },
              {
                title: 'Shape Our Client Stories',
                description: 'Research, narratives, and client-facing materials for pursuits and go-to-market sales support',
              },
              {
                title: 'Strengthen Our Team',
                description: 'Community building and team connection',
              },
              {
                title: 'Scale Delivery Excellence',
                description: 'Templates, standards, and process improvements',
              },
            ].map((area) => (
              <div
                key={area.title}
                className="bg-primary-soft p-4 rounded-lg border border-primary-border"
              >
                <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-soft border border-primary-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-foreground">
              <li>Enter your name and region</li>
              <li>Rate your interest in each area (1-5 scale)</li>
              <li>Answer detailed questions for areas that interest you</li>
              <li>Choose your top 2 area preferences</li>
              <li>Share your growth goals and availability</li>
              <li>Review and submit your response</li>
            </ol>
          </div>

          <div className="bg-muted border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Rating Scale:</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">1 = Not at all like me</span>
              <span className="text-muted-foreground">&rarr;</span>
              <span className="text-muted-foreground">5 = Very much like me</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              If you rate an area 1 or 2, you'll skip its detailed questions.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onStart} className="px-8 py-3 text-lg">
            Get Started
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Takes about 7 minutes</p>
        </div>
      </div>
    </motion.div>
  );
}
