'use client'

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"

import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import ExpenseTable from "./ExpenseTable"

export default function Manage_Expenses() {
    const [date, setDate] = useState(new Date());
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [categoryId, setCategoryId] = useState("");  // selected category in input

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState(""); // new category name to be added
    const [categories, setCategories] = useState([]) // list of categories as objects to be shown in menu (fetched from server)
    const [addingCategory, setAddingCategory] = useState(false); // loading button state for category

    const [addingExpense, setAddingExpense] = useState(false); // loading button state for expenses
    const [expenses, setExpenses] = useState([]) // list of expenses from server

    const [fromDate, setFromDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"));
    const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [rangeSelector, setRangeSelector] = useState("");

    const getCategories = async () => {
        const res = await fetch('/api/category');
        const { data, error } = await res.json();
        if (error) {
            toast.error(error, { position: "top-right" });
        }
        setCategories(data ?? [])
    }

    const getExpenses = async () => {
        const res = await fetch(`/api/expense?start=${fromDate}&end=${toDate}`);
        const { data, error } = await res.json();
        if (error) {
            toast.error(error, { position: "top-right" });
        }
        setExpenses(data ?? [])
    }

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        getExpenses();
    }, [fromDate, toDate])

    useEffect(() => {
        if (rangeSelector === "this_month") {

            const start = new Date();
            const end = new Date();

            start.setDate(1);

            setFromDate(format(start, 'yyyy-MM-dd'));
            setToDate(format(end, 'yyyy-MM-dd'));
        }

        if (rangeSelector === "28_days") {
            const start = new Date();
            const end = new Date();

            start.setDate(start.getDate() - 27)

            setFromDate(format(start, 'yyyy-MM-dd'));
            setToDate(format(end, 'yyyy-MM-dd'));
        }

        if (rangeSelector === "6_months") {
            const start = new Date();
            const end = new Date();

            start.setDate(1);
            start.setMonth(start.getMonth() - 6);

            setFromDate(format(start, 'yyyy-MM-dd'));
            setToDate(format(end, 'yyyy-MM-dd'));
        }

    }, [rangeSelector])

    const addCategory = async () => {
        setAddingCategory(true)

        const res = await fetch("/api/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newCategory
            }),
        });

        const { message, error } = await res.json();
        if (error)
            toast.error(error, { position: "top-right" });

        else {
            getCategories();
            toast.success(message, { position: "top-right" });
        }

        setIsCategoryModalOpen(false);
        setNewCategory("");
        setAddingCategory(false)
    }

    const addExpense = async (e) => {
        e.preventDefault();
        setAddingExpense(true);

        setAmount(Number(amount));

        if (!categoryId || !amount || !date) {
            if (!categoryId)
                toast.warning('Please choose a category', { position: "top-right" })
            if (amount <= 0)
                toast.warning('Please enter correct amount', { position: "top-right" })

            if (!date)
                toast.warning('Please select a date', { position: "top-right" })

            setAddingExpense(false);
            return
        }

        const payload = {
            category_id: categoryId, amount: Number(amount), expense_date: format(date, "yyyy-MM-dd"), note
        }

        const res = await fetch("/api/expense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const { message, error } = await res.json();
        if (error)
            toast.error(error, { position: "top-right" });

        else {
            getExpenses();
            toast.success(message, { position: "top-right" });
        }

        setCategoryId("");
        setAmount("");
        setNote("");
        setAddingExpense(false);
    }

    return (<div className="pt-8">
        <Card className={"w-full mx-auto max-w-250"}>
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <Label htmlFor="new-category">Category name</Label>
                        <Input
                            id="new-category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="e.g. Groceries"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCategoryModalOpen(false);
                                setNewCategory("");
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={addCategory}
                            disabled={!newCategory.trim() || addingCategory}
                        >
                            {addingCategory ? "Adding... " : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <CardHeader>
                <CardDescription>
                    Add your expense
                </CardDescription>
            </CardHeader>
            <form onSubmit={addExpense} noValidate>
                <CardContent>
                    <div className="flex flex-wrap gap-6">

                        {/* category */}
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="category">Category</Label>
                            </div>

                            <NativeSelect
                                id="category"
                                value={categoryId}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "__add__") {
                                        setIsCategoryModalOpen(true);
                                        setCategoryId("");
                                        return;
                                    }

                                    setCategoryId(value);
                                }}
                            >
                                <NativeSelectOption value="" disabled hidden>
                                    Select category
                                </NativeSelectOption>

                                <NativeSelectOption value="__add__">
                                    + Add Category
                                </NativeSelectOption>

                                {categories.map((cat) => (
                                    <NativeSelectOption
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {cat.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>

                        {/* amount */}
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="amount">Amount</Label>
                            </div>
                            <Input id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Add amount"
                                required />
                        </div>

                        {/* date */}
                        <div>
                            <Field className=" grid gap-2">
                                <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date-picker-simple"
                                            className=" font-normal"
                                        >

                                            {date ? format(date, "PPP") : <span>Pick a date</span>}

                                            <CalendarIcon className="h-4 w-4 opacity-50" />

                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            defaultMonth={date}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </div>

                        {/* note */}
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="note">Note<span className="text-sm text-muted-foreground italic font-medium">(Optional)</span></Label>
                            </div>
                            <Input id="note"
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add note"
                            />
                        </div>



                    </div>
                </CardContent>
                <CardFooter className=" mt-8">
                    <Button type="submit" className="" disabled={addingExpense}>
                        {addingExpense ? "Adding.." : "Add"}
                    </Button>
                </CardFooter>

            </form>

        </Card>

        {/* expense history */}
        <Card className="w-full mx-auto max-w-250 mt-8">
            <CardHeader>
                <CardTitle>All Expenses</CardTitle>
                {/* <CardDescription>
                    
                </CardDescription> */}

                <CardAction>
                    <NativeSelect
                        id="range-selector"
                        value={rangeSelector}
                        onChange={(e) => {
                            const value = e.target.value;
                            setRangeSelector(value);
                        }}
                    >
                        <NativeSelectOption value="this_month">
                            This Month
                        </NativeSelectOption>
                        <NativeSelectOption value="28_days">
                            Last 28 days
                        </NativeSelectOption>
                        <NativeSelectOption value="6_months">
                            Last 6 months
                        </NativeSelectOption>

                    </NativeSelect>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ExpenseTable expenses={expenses} onDeleteSuccess={getExpenses} />
            </CardContent>
            <CardFooter className="">

            </CardFooter>
        </Card>
    </div >)
}

