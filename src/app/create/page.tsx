"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuestionSet, Question, QuestionType } from "@/types";

export default function CreatePage() {
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: uuidv4(),
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        answer: "",
    });
    const [newSetName, setNewSetName] = useState("");

    useEffect(() => {
        const storedSets = localStorage.getItem("questionSets");
        if (storedSets) {
            setQuestionSets(JSON.parse(storedSets));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("questionSets", JSON.stringify(questionSets));
    }, [questionSets]);

    const handleSetChange = (setId: string) => {
        const set = questionSets.find((s) => s.id === setId) || null;
        setCurrentSet(set);
    };

    const handleNewSet = () => {
        const newSet: QuestionSet = {
            id: uuidv4(),
            title: `新しい問題集 ${questionSets.length + 1}`,
            questions: [],
        };
        setQuestionSets([...questionSets, newSet]);
        setCurrentSet(newSet);
    };

    const handleRenameSet = () => {
        if (currentSet && newSetName) {
            const updatedSets = questionSets.map((set) =>
                set.id === currentSet.id ? { ...set, title: newSetName } : set
            );
            setQuestionSets(updatedSets);
            setCurrentSet({ ...currentSet, title: newSetName });
            setNewSetName("");
        }
    };

    const handleDeleteSet = () => {
        if (currentSet) {
            const updatedSets = questionSets.filter(
                (set) => set.id !== currentSet.id
            );
            setQuestionSets(updatedSets);
            setCurrentSet(null);
        }
    };

    const handleQuestionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCurrentQuestion({ ...currentQuestion, question: e.target.value });
    };

    const handleTypeChange = (type: QuestionType) => {
        setCurrentQuestion({
            ...currentQuestion,
            type,
            options: type === "multiple-choice" ? ["", "", "", ""] : undefined,
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        if (currentQuestion.options) {
            const newOptions = [...currentQuestion.options];
            newOptions[index] = value;
            setCurrentQuestion({ ...currentQuestion, options: newOptions });
        }
    };

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentQuestion({ ...currentQuestion, answer: e.target.value });
    };

    const handleAddQuestion = () => {
        if (currentSet && currentQuestion.question && currentQuestion.answer) {
            const updatedSet = {
                ...currentSet,
                questions: [...currentSet.questions, currentQuestion],
            };
            setQuestionSets(
                questionSets.map((set) =>
                    set.id === currentSet.id ? updatedSet : set
                )
            );
            setCurrentSet(updatedSet);
            setCurrentQuestion({
                id: uuidv4(),
                type: "multiple-choice",
                question: "",
                options: ["", "", "", ""],
                answer: "",
            });
        } else {
            alert("問題集を選択し、すべての必須項目を入力してください。");
        }
    };

    const handleExport = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(questionSets));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "question_sets.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
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
                        localStorage.setItem("questionSets", content);
                    } catch (error) {
                        console.error("Invalid JSON file", error);
                        alert("無効なJSONファイルです。");
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>問題集管理</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Select
                                onValueChange={handleSetChange}
                                value={currentSet?.id}
                            >
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
                            {currentSet && (
                                <span className="text-sm text-muted-foreground">
                                    現在の問題集: {currentSet.title}
                                </span>
                            )}
                        </div>
                        <Button onClick={handleNewSet}>新しい問題集</Button>
                    </div>
                    <div className="flex justify-between mb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={!currentSet}
                                >
                                    問題集名変更
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>問題集名の変更</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="new-set-name">
                                        新しい問題集名
                                    </Label>
                                    <Input
                                        id="new-set-name"
                                        value={newSetName}
                                        onChange={(e) =>
                                            setNewSetName(e.target.value)
                                        }
                                        placeholder="新しい問題集名を入力"
                                    />
                                </div>
                                <DialogClose asChild>
                                    <Button onClick={handleRenameSet}>
                                        変更
                                    </Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={!currentSet}
                                >
                                    問題集削除
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        問題集の削除
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        この操作は取り消せません。本当にこの問題集を削除しますか？
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        キャンセル
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteSet}
                                    >
                                        削除
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={handleExport}>エクスポート</Button>
                        <div>
                            <input
                                type="file"
                                id="import"
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                            />
                            <Button asChild>
                                <label htmlFor="import">インポート</label>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {currentSet && (
                <Card>
                    <CardHeader>
                        <CardTitle>{currentSet.title} - 新しい問題</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question-type">問題タイプ</Label>
                            <Select
                                onValueChange={(value: QuestionType) =>
                                    handleTypeChange(value)
                                }
                            >
                                <SelectTrigger id="question-type">
                                    <SelectValue placeholder="タイプを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple-choice">
                                        多肢選択
                                    </SelectItem>
                                    <SelectItem value="text">記述式</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="question">問題</Label>
                            <Textarea
                                id="question"
                                value={currentQuestion.question}
                                onChange={handleQuestionChange}
                                placeholder="問題文を入力してください"
                            />
                        </div>
                        {currentQuestion.type === "multiple-choice" &&
                            currentQuestion.options &&
                            currentQuestion.options.map((option, index) => (
                                <div key={index} className="space-y-2">
                                    <Label htmlFor={`option-${index}`}>
                                        選択肢 {index + 1}
                                    </Label>
                                    <Input
                                        id={`option-${index}`}
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`選択肢 ${
                                            index + 1
                                        } を入力してください`}
                                    />
                                </div>
                            ))}
                        <div className="space-y-2">
                            <Label htmlFor="answer">正解</Label>
                            <Input
                                id="answer"
                                value={currentQuestion.answer}
                                onChange={handleAnswerChange}
                                placeholder="正解を入力してください"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAddQuestion}>問題を追加</Button>
                    </CardFooter>
                </Card>
            )}

            {currentSet && currentSet.questions.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">
                        作成した問題 ({currentSet.questions.length})
                    </h2>
                    {currentSet.questions.map((q, index) => (
                        <Card key={q.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>問題 {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{q.question}</p>
                                {q.type === "multiple-choice" && q.options && (
                                    <ul className="list-disc list-inside mt-2">
                                        {q.options.map(
                                            (option, optionIndex) => (
                                                <li key={optionIndex}>
                                                    {option}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                                <p className="mt-2">正解: {q.answer}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
