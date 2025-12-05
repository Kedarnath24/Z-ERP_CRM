import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, DollarSign, Star, Sparkles, X, CreditCard, Banknote, Smartphone, CheckCircle2, Zap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billAmount: number;
  staffMember: string;
  staffId: string;
  transactionId: string;
  customerName?: string;
  branchId: string;
  serviceStaff?: Array<{ name: string; id: string }>; // Multiple staff who served
}

const SUGGESTED_TIP_PERCENTAGES = [10, 15, 20, 25];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: Banknote, color: 'from-green-400 to-emerald-500' },
  { id: 'card', name: 'Card', icon: CreditCard, color: 'from-blue-400 to-indigo-500' },
  { id: 'upi', name: 'UPI', icon: Smartphone, color: 'from-purple-400 to-pink-500' },
];

export default function TipDialog({
  isOpen,
  onClose,
  billAmount,
  staffMember,
  staffId,
  transactionId,
  customerName,
  branchId,
  serviceStaff = [],
}: TipDialogProps) {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffId);
  const [selectedStaffName, setSelectedStaffName] = useState<string>(staffMember);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const calculateTipAmount = () => {
    if (customAmount) {
      return parseFloat(customAmount) || 0;
    }
    if (selectedPercentage) {
      return (billAmount * selectedPercentage) / 100;
    }
    return 0;
  };

  const tipAmount = calculateTipAmount();

  const handleTipSubmit = () => {
    if (tipAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please select or enter a tip amount',
        variant: 'destructive',
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: 'Select Payment Method',
        description: 'Please choose how the tip will be paid',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Save tip to localStorage with payment method
    const tipData = {
      id: `tip_${Date.now()}`,
      transactionId,
      staffId: selectedStaffId,
      staffMember: selectedStaffName,
      amount: tipAmount,
      billAmount,
      customerName: customerName || 'Walk-in Customer',
      timestamp: new Date().toISOString(),
      branchId,
      paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
      tipPercentage: selectedPercentage || 0,
    };

    // Get existing tips
    const existingTips = JSON.parse(localStorage.getItem(`tips_${branchId}`) || '[]');
    existingTips.push(tipData);
    localStorage.setItem(`tips_${branchId}`, JSON.stringify(existingTips));

    // Update staff tips summary
    const staffTipsSummary = JSON.parse(localStorage.getItem(`staff_tips_summary_${branchId}`) || '{}');
    if (!staffTipsSummary[selectedStaffId]) {
      staffTipsSummary[selectedStaffId] = {
        staffName: selectedStaffName,
        totalTips: 0,
        tipCount: 0,
      };
    }
    staffTipsSummary[selectedStaffId].totalTips += tipAmount;
    staffTipsSummary[selectedStaffId].tipCount += 1;
    localStorage.setItem(`staff_tips_summary_${branchId}`, JSON.stringify(staffTipsSummary));

    // Show success animation
    setShowSuccess(true);
    
    setTimeout(() => {
      toast({
        title: '💖 Thank You!',
        description: `₹${tipAmount.toFixed(2)} tip added for ${selectedStaffName} via ${paymentMethod.toUpperCase()}`,
      });
      setIsSubmitting(false);
      setTimeout(handleClose, 1000);
    }, 1500);
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    setSelectedPercentage(null);
    setCustomAmount('');
    setPaymentMethod('cash');
    setShowSuccess(false);
    setSelectedStaffId(staffId);
    setSelectedStaffName(staffMember);
    onClose();
  };

  const handlePercentageClick = (percentage: number) => {
    setSelectedPercentage(percentage);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPercentage(null);
  };

  const handleStaffSelect = (id: string, name: string) => {
    setSelectedStaffId(id);
    setSelectedStaffName(name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Tip Sent Successfully! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-center"
              >
                ₹{tipAmount.toFixed(2)} sent to {selectedStaffName}
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex gap-2"
              >
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="h-6 w-6 text-pink-500 fill-pink-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg"
                    >
                      <Heart className="h-6 w-6 text-white fill-white" />
                    </motion.div>
                    <div>
                      <DialogTitle className="text-xl">Show Your Appreciation</DialogTitle>
                      <DialogDescription className="text-sm">
                        Leave a tip for your service staff
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-4">
                {/* Bill Summary */}
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Bill Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{billAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Staff Selection - if multiple staff */}
                {serviceStaff && serviceStaff.length > 1 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Select Staff Member to Tip
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceStaff.map((staff) => (
                        <motion.button
                          key={staff.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStaffSelect(staff.id, staff.name)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            selectedStaffId === staff.id
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              selectedStaffId === staff.id ? 'bg-purple-500' : 'bg-gray-300'
                            }`}>
                              <Star className={`h-4 w-4 ${selectedStaffId === staff.id ? 'text-white fill-white' : 'text-gray-600'}`} />
                            </div>
                            <span className={`text-sm font-medium ${selectedStaffId === staff.id ? 'text-purple-700' : 'text-gray-700'}`}>
                              {staff.name}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Percentages */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Quick Tip Suggestions
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {SUGGESTED_TIP_PERCENTAGES.map((percentage) => {
                      const amount = (billAmount * percentage) / 100;
                      const isSelected = selectedPercentage === percentage;
                      return (
                        <motion.button
                          key={percentage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePercentageClick(percentage)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all overflow-hidden ${
                            isSelected
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1 right-1"
                            >
                              <Zap className="h-3 w-3 text-purple-600 fill-purple-600" />
                            </motion.div>
                          )}
                          <span className={`text-xl font-bold ${isSelected ? 'text-purple-600' : 'text-gray-900'}`}>
                            {percentage}%
                          </span>
                          <span className={`text-xs font-medium mt-1 ${isSelected ? 'text-purple-500' : 'text-gray-500'}`}>
                            ₹{amount.toFixed(0)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${method.color} mb-2`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                            {method.name}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-600" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="pl-9 text-lg font-medium h-12 border-2"
                      min="0"
                      step="10"
                    />
                  </div>
                </div>

                {/* Total Preview */}
                {tipAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-5 border-2 border-green-300 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                          <Star className="h-4 w-4 text-white fill-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Tip Amount</span>
                      </div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{tipAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-green-200">
                      <span>Staff: {selectedStaffName}</span>
                      <span>Method: {paymentMethod.toUpperCase()}</span>
                    </div>
                  </motion.div>
                )}

                {/* Appreciation Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3"
                >
                  <p className="text-sm text-gray-600 font-medium flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                    "Your generosity makes a difference!"
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                  </p>
                </motion.div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 mt-2">
                <Button 
                  variant="outline" 
                  onClick={handleSkip} 
                  disabled={isSubmitting} 
                  className="flex-1 border-2 hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Skip
                </Button>
                <Button
                  onClick={handleTipSubmit}
                  disabled={isSubmitting || tipAmount <= 0}
                  className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Processing...' : 'Confirm Tip'}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
