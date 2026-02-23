import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Lead {
  status: string;
  [key: string]: any;
}

interface LeadJourneyProps {
  lead: Lead;
  onStatusChange?: (newStatus: string) => void;
}

const journeyStages = [
  { id: "new", label: "New", color: "bg-gray-500" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500" },
  { id: "qualified", label: "Qualified", color: "bg-purple-500" },
  { id: "proposal", label: "Proposal", color: "bg-amber-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "won", label: "Won", color: "bg-green-500" }
];

export default function LeadJourney({ lead, onStatusChange }: LeadJourneyProps) {
  const currentStageIndex = journeyStages.findIndex(s => s.id === lead.status);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Lead Journey</div>
          
          {/* Desktop Journey View */}
          <div className="hidden md:flex items-center justify-between gap-2">
            {journeyStages.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isUpcoming = index > currentStageIndex;

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <div
                    className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                      isCurrent ? "scale-110" : ""
                    }`}
                    onClick={() => onStatusChange?.(stage.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? `${stage.color} text-white shadow-lg`
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div
                      className={`mt-2 text-xs font-medium text-center ${
                        isCurrent ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {stage.label}
                    </div>
                  </div>
                  {index < journeyStages.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-300 -mt-8">
                      <div
                        className={`h-full ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                        style={{
                          width: isCompleted ? "100%" : "0%",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Journey View */}
          <div className="md:hidden space-y-2">
            {journeyStages.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                    isCurrent ? "bg-white shadow-md" : ""
                  }`}
                  onClick={() => onStatusChange?.(stage.id)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? `${stage.color} text-white`
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <Badge className="ml-auto">Current</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
