"use client"

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ExpenseTable = ({ expenses, onDeleteSuccess, onEdit }) => {

    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        setDeletingId(id)
        const res = await fetch(`/api/expense/${id}`, {
            method: "DELETE"
        })

        const { message, error } = await res.json();
        if (error) {
            toast.error(error, { position: 'top-right' })
            setDeletingId(null)
            return
        }

        toast.success(message, { position: "top-right" })
        onDeleteSuccess();
        setDeletingId(null)
    }

    if (expenses.length == 0)
        return (
            <p className="text-sm text-muted-foreground">
                No expense found.
            </p>
        )

    return (
        <div className="w-full overflow-x-auto">
            <Table className={" "}>
                <TableHeader>
                    <TableRow>
                        <TableHead className={""}>Category</TableHead>
                        <TableHead className={"text-center"}>Amount</TableHead>
                        <TableHead className={" text-center w-[40%] "}>Note</TableHead>
                        <TableHead className={"text-center"}>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell >
                                {expense.categories?.name ?? "-"}
                            </TableCell>

                            <TableCell className={"text-center"}>
                                ₹{expense.amount}
                            </TableCell>

                            <TableCell className={" text-center whitespace-normal"}>
                                {expense.note || "-"}
                            </TableCell>

                            <TableCell className={"text-center "}>
                                {expense.expense_date}
                            </TableCell>
                            <TableCell className="text-right" >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild >
                                        <Button variant="ghost" size="icon" disabled={deletingId === expense.id} className="size-8">
                                            <MoreHorizontalIcon />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(expense)}>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            if (confirm("Are you sure, you want to delete this expense")) {
                                                handleDelete(expense.id)
                                            }
                                        }}
                                            variant="destructive">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table >
        </div>
    )
}

export default ExpenseTable;