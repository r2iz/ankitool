"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QuestionSet } from "@/types";

export default function SolvePage() {
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const storedSets = localStorage.getItem("questionSets");
        if (storedSets) {
            setQuestionSets(JSON.parse(storedSets));
        }
    }, []);

    const handleSetChange = (setId: string) => {
        const set = questionSets.find((s) => s.id === setId) || null;
        setCurrentSet(set);
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setShowResult(false);
    };

    const currentQuestion = currentSet?.questions[currentQuestionIndex];

    const handleSubmit = () => {
        if (selectedAnswer) {
            setShowResult(true);
        }
    };

    const handleNext = () => {
        if (
            currentSet &&
            currentQuestionIndex < currentSet.questions.length - 1
        ) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer("");
            setShowResult(false);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === "string") {
                    try {
                        const importedSets = JSON.parse(content);
                        setQuestionSets(importedSets);
                    } catch (error) {
                        console.error("Invalid JSON file", error);
                        alert("無効なJSONファイルです。");
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    if (questionSets.length === 0) {
        return (
            <div className="text-center">
                <p className="mb-4">
                    問題集がありません。問題を作成するか、JSONファイルをインポートしてください。
                </p>
                <div>
                    <input
                        type="file"
                        id="import"
                        className="hidden"
                        accept=".json"
                        onChange={handleImport}
                    />
                    <Button asChild>
                        <label htmlFor="import">問題集をインポート</label>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>問題集選択</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={handleSetChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="問題集を選択" />
                        </SelectTrigger>
                        <SelectContent>
                            {questionSets.map((set) => (
                                <SelectItem key={set.id} value={set.id}>
                                    {set.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {currentSet && currentQuestion && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {currentSet.title} - 問題 {currentQuestionIndex + 1}{" "}
                            / {currentSet.questions.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium mb-4">
                            {currentQuestion.question}
                        </p>
                        {currentQuestion.type === "multiple-choice" &&
                            currentQuestion.options && (
                                <RadioGroup
                                    value={selectedAnswer}
                                    onValueChange={setSelectedAnswer}
                                >
                                    {currentQuestion.options.map(
                                        (option, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`option-${index}`}
                                                />
                                                <Label
                                                    htmlFor={`option-${index}`}
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        )
                                    )}
                                </RadioGroup>
                            )}
                        {currentQuestion.type === "text" && (
                            <Input
                                value={selectedAnswer}
                                onChange={(e) =>
                                    setSelectedAnswer(e.target.value)
                                }
                                placeholder="回答を入力してください"
                            />
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {!showResult ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedAnswer}
                            >
                                回答する
                            </Button>
                        ) : (
                            <>
                                <div
                                    className={
                                        selectedAnswer ===
                                        currentQuestion.answer
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                >
                                    {selectedAnswer === currentQuestion.answer
                                        ? "正解！"
                                        : `不正解。正解は${currentQuestion.answer}です。`}
                                </div>
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        currentQuestionIndex ===
                                        currentSet.questions.length - 1
                                    }
                                >
                                    次の問題
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
