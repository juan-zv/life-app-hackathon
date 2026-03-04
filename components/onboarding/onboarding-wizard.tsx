"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Sparkles, SkipForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StepFoodHealth } from "./step-food-health"
import { StepAcademics } from "./step-academics"
import { StepSubscriptions } from "./step-subscriptions"
import { onboardingSchema, type OnboardingData } from "./schema"

const steps = [
  { id: "food-health", label: "Food & Health", component: StepFoodHealth },
  { id: "academics", label: "Academics", component: StepAcademics },
  { id: "subscriptions", label: "Subscriptions", component: StepSubscriptions },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [showPreview, setShowPreview] = React.useState(false)
  const router = useRouter()

  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema as any),
    mode: "onChange",
    defaultValues: {
      foodHealth: {
        householdSize: 1,
      },
    },
  })

  const { trigger, getValues, handleSubmit, watch } = methods

  const handleNext = async () => {
    let isValid = false

    if (currentStep === 0) {
      isValid = await trigger([
        "foodHealth.dietaryRestrictions",
        "foodHealth.cookingSkill",
        "foodHealth.householdSize",
      ])
    } else if (currentStep === 1) {
      isValid = await trigger([
        "academics.currentLevel",
        "academics.major",
        "academics.learningStyle",
      ])
    } else if (currentStep === 2) {
      isValid = await trigger([
        "subscriptions.bankSync",
        "subscriptions.forgetfulMetric",
      ])
    }

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setShowPreview(true)
      }
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setShowPreview(true)
    }
  }

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false)
      return
    }
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = () => {
    router.push("/sign-up")
  }

  const CurrentStepComponent = steps[currentStep].component
  const formData = watch()

  // Build a clean preview of what's been filled
  const previewData: Record<string, any> = {}
  if (formData.foodHealth?.dietaryRestrictions || formData.foodHealth?.cookingSkill) {
    previewData.foodHealth = {
      ...(formData.foodHealth.dietaryRestrictions && { diet: formData.foodHealth.dietaryRestrictions }),
      ...(formData.foodHealth.cookingSkill && { skill: formData.foodHealth.cookingSkill }),
      ...(formData.foodHealth.householdSize && { household: formData.foodHealth.householdSize }),
    }
  }
  if (formData.academics?.currentLevel || formData.academics?.major) {
    previewData.academics = {
      ...(formData.academics.currentLevel && { level: formData.academics.currentLevel }),
      ...(formData.academics.major && { major: formData.academics.major }),
      ...(formData.academics.learningStyle && { style: formData.academics.learningStyle }),
    }
  }
  if (formData.subscriptions?.bankSync || formData.subscriptions?.forgetfulMetric) {
    previewData.subscriptions = {
      ...(formData.subscriptions.bankSync && { tracking: formData.subscriptions.bankSync }),
      ...(formData.subscriptions.forgetfulMetric && { forgetfulness: formData.subscriptions.forgetfulMetric }),
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-medium">
              Step {showPreview ? steps.length : currentStep + 1} of {steps.length}
            </Badge>
            {!showPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={handleSkip}
              >
                Skip <SkipForward className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i < currentStep || showPreview
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep && !showPreview
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      i < currentStep || showPreview ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <Progress
            value={((showPreview ? steps.length : currentStep + 1) / steps.length) * 100}
            className="h-1.5"
          />
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {showPreview ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">You&apos;re all set!</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Here&apos;s what we&apos;ll use to personalize your dashboard.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs overflow-auto max-h-60">
                <pre className="text-foreground whitespace-pre-wrap">
                  {JSON.stringify(
                    Object.keys(previewData).length > 0 ? previewData : { message: "No preferences set — defaults will be used" },
                    null,
                    2
                  )}
                </pre>
              </div>

              <p className="text-muted-foreground text-xs text-center">
                This data shapes your Food, Academics & Subscriptions experience. You can update it anytime from Settings.
              </p>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form className="space-y-6">
                <CurrentStepComponent />
              </form>
            </FormProvider>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 && !showPreview}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {showPreview ? (
            <Button onClick={handleFinish} className="gap-1.5">
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-1.5">
              {currentStep === steps.length - 1 ? "Review" : "Continue"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
