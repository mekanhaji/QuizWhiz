"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useSettingStore } from "@/store/setting";
import { useShallow } from "zustand/react/shallow";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const {
    autoNextQuestion,
    setAutoNextQuestion,
    autoNextQuestionDelay,
    setAutoNextQuestionDelay,
    repeatWrongedQuestions,
    setRepeatWrongedQuestions,
    repeatSlowQuestions,
    setRepeatSlowQuestions,
    slowAnswerMultiplier,
    setSlowAnswerMultiplier,
    maxRepeatRounds,
    setMaxRepeatRounds,
  } = useSettingStore(
    useShallow((state) => ({
      autoNextQuestion: state.autoNextQuestion,
      setAutoNextQuestion: state.setAutoNextQuestion,
      autoNextQuestionDelay: state.autoNextQuestionDelay,
      setAutoNextQuestionDelay: state.setAutoNextQuestionDelay,
      repeatWrongedQuestions: state.repeatWrongedQuestions,
      setRepeatWrongedQuestions: state.setRepeatWrongedQuestions,
      repeatSlowQuestions: state.repeatSlowQuestions,
      setRepeatSlowQuestions: state.setRepeatSlowQuestions,
      slowAnswerMultiplier: state.slowAnswerMultiplier,
      setSlowAnswerMultiplier: state.setSlowAnswerMultiplier,
      maxRepeatRounds: state.maxRepeatRounds,
      setMaxRepeatRounds: state.setMaxRepeatRounds,
    })),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Quiz settings">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Settings</DialogTitle>
          <DialogDescription>
            Changes apply immediately and are saved on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <h3 className="mb-2 font-code text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Auto-advance
            </h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="setting-auto-next">Auto-advance</Label>
                  <p className="text-xs text-muted-foreground">
                    Move to the next question automatically once you submit
                    an answer.
                  </p>
                </div>
                <Switch
                  id="setting-auto-next"
                  checked={autoNextQuestion}
                  onCheckedChange={setAutoNextQuestion}
                />
              </div>

              {autoNextQuestion && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="setting-auto-next-delay">Delay</Label>
                    <span className="font-code text-sm font-bold tabular-nums">
                      {autoNextQuestionDelay}s
                    </span>
                  </div>
                  <Slider
                    id="setting-auto-next-delay"
                    min={3}
                    max={60}
                    step={1}
                    value={[autoNextQuestionDelay]}
                    onValueChange={([value]) =>
                      setAutoNextQuestionDelay(value)
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-code text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Adaptive review
            </h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="setting-repeat-wrong">
                    Repeat missed questions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Questions you get wrong come back in a review round until
                    you answer them correctly.
                  </p>
                </div>
                <Switch
                  id="setting-repeat-wrong"
                  checked={repeatWrongedQuestions}
                  onCheckedChange={setRepeatWrongedQuestions}
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="setting-repeat-slow">
                    Repeat slow answers
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Correct answers that took much longer than average also
                    come back for review.
                  </p>
                </div>
                <Switch
                  id="setting-repeat-slow"
                  checked={repeatSlowQuestions}
                  onCheckedChange={setRepeatSlowQuestions}
                />
              </div>

              {repeatSlowQuestions && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="setting-slow-multiplier">
                      Slow threshold
                    </Label>
                    <span className="font-code text-sm font-bold tabular-nums">
                      {slowAnswerMultiplier.toFixed(1)}×
                    </span>
                  </div>
                  <Slider
                    id="setting-slow-multiplier"
                    min={1.1}
                    max={3}
                    step={0.1}
                    value={[slowAnswerMultiplier]}
                    onValueChange={([value]) =>
                      setSlowAnswerMultiplier(value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Flagged when an answer takes longer than this multiple of
                    the round&apos;s average time.
                  </p>
                </div>
              )}

              {(repeatWrongedQuestions || repeatSlowQuestions) && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="setting-max-rounds">
                      Max review rounds
                    </Label>
                    <span className="font-code text-sm font-bold tabular-nums">
                      {maxRepeatRounds}
                    </span>
                  </div>
                  <Slider
                    id="setting-max-rounds"
                    min={1}
                    max={10}
                    step={1}
                    value={[maxRepeatRounds]}
                    onValueChange={([value]) => setMaxRepeatRounds(value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Stops repeating a question after this many review rounds,
                    even if it&apos;s still missed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
