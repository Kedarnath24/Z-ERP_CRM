import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="space-y-8 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl relative overflow-hidden">
      {/* 3D depth background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl" />
      <motion.div 
        className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-gray-900/5 to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative z-10">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <motion.div 
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`
                      relative flex items-center justify-center w-14 h-14 rounded-2xl font-bold text-base
                      transition-all duration-300 transform-gpu
                      ${isCompleted ? 'bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-xl' : ''}
                      ${isCurrent ? 'bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-2xl scale-110' : ''}
                      ${isUpcoming ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 border-2 border-gray-300' : ''}
                    `}
                    data-testid={`step-indicator-${step.number}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={isCurrent ? {
                      boxShadow: [
                        '0 10px 40px rgba(0, 0, 0, 0.1)',
                        '0 15px 50px rgba(0, 0, 0, 0.15)',
                        '0 10px 40px rgba(0, 0, 0, 0.1)',
                      ],
                    } : {}}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    {/* 3D effect layers */}
                    {(isCompleted || isCurrent) && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                        <div className="absolute -inset-1 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl blur-md opacity-50 -z-10" />
                      </>
                    )}
                    
                    <span className="relative z-10">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <Check className="w-7 h-7" />
                        </motion.div>
                      ) : (
                        step.number
                      )}
                    </span>
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <motion.div
                      className="relative w-1 h-20 mt-3 rounded-full overflow-hidden bg-gray-200"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-700 rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: currentStep > step.number ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ transformOrigin: 'top' }}
                      />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1 pt-2">
                  <motion.div 
                    className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
                    animate={isCurrent ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Step {step.number}
                  </motion.div>
                  
                  <h3
                    className={`font-bold text-lg transition-all duration-300 ${
                      isCurrent ? 'text-gray-900 scale-105' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}
                    data-testid={`step-title-${step.number}`}
                  >
                    {step.title}
                  </h3>
                  
                  {isCurrent && (
                    <motion.p 
                      className="text-sm text-gray-600 mt-3 leading-relaxed"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="h-8" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
