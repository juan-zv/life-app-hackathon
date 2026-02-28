"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { StepFoodHealth } from "./step-food-health"
import { StepAcademics } from "./step-academics"
import { StepSubscriptions } from "./step-subscriptions"
import { onboardingSchema, type OnboardingData } from "./schema"

const steps = [
  { id: "food-health", component: StepFoodHealth },
  { id: "academics", component: StepAcademics },
  { id: "subscriptions", component: StepSubscriptions },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = React.useState(0)
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

  const { trigger, getValues, handleSubmit } = methods

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
        await onSubmit(getValues())
      }
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onSubmit(getValues())
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onSubmit = (data: OnboardingData) => {
    // Generate JSON file for download
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "user.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Redirect to dashboard
    router.push("/")
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip
            </Button>
          </div>
          {/* Progress Bar could go here */}
          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full mt-2">
            <div
              className="bg-primary h-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FormProvider {...methods}>
            <form className="space-y-8">
              <CurrentStepComponent />
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
