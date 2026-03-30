"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter, DialogHeader, DialogTitle, DialogContent, Dialog } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";

export default function Manage_Categories() {

    const [categories, setCategories] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState(""); // new category name to be added
    const [addingCategory, setAddingCategory] = useState(false);
    const [updateCategory, setUpdateCategory] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const getCategories = async () => {
        const res = await fetch("/api/category");
        const { data, error } = await res.json();

        if (error) {
            toast.error(error, { position: "top-right" });
        }

        setCategories(data);
    }

    const handleDelete = async (id) => {
        setDeletingId(id)
        const res = await fetch(`/api/category/${id}`, {
            method: "DELETE"
        })

        const { message, error } = await res.json();
        if (error) {
            toast.error(error, { position: 'top-right' })
            setDeletingId(null)
            return
        }

        toast.success(message, { position: "top-right" })
        getCategories();
        setDeletingId(null)
    }

    useEffect(() => {
        getCategories();
    }, [])

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

    const updateCategoryHandler = async () => {
        setIsUpdating(true);

        if (!newCategory) {
            toast.warning('Please ', { position: "top-right" })
            setIsUpdating(false);
            setIsEditModalOpen(false);
            setUpdateCategory({});
            return
        }
        const payload = {
            name: newCategory
        }

        const res = await fetch(`/api/category/${updateCategory?.id}`, {
            method: "PUT",
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

        // after finished executing
        setIsUpdating(false);
        setIsEditModalOpen(false);
        setUpdateCategory({});
    }



    return (
        <div>
            {/* add category modal */}
            <Dialog open={isCategoryModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) resetStuff();
            }}>
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

            {/* edit modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open)
                    setUpdateCategory(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>

                    {/* name */}
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="category">Category</Label>
                        </div>
                        <Input id="category"
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            required />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setUpdateCategory({});
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={updateCategoryHandler}
                            disabled={isUpdating || newCategory.trim() === updateCategory?.name}
                        >
                            {isUpdating ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="w-full mx-auto max-w-250 mt-4">
                <CardHeader className={"flex justify-between items-center"}>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent >
                    <div className="w-full overflow-x-auto">
                        <Table className={" "}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={"md:w-32"}>Category</TableHead>
                                    <TableHead className={"text-center"}>Created At</TableHead>
                                    <TableHead className={"text-center"}>Updated At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>

                                        <TableCell >
                                            {category?.name ?? "-"}
                                        </TableCell>

                                        <TableCell className={"text-center "}>
                                            {format(new Date(category?.created_at), "yyyy-MM-dd")}
                                        </TableCell>
                                        <TableCell className={"text-center "}>
                                            {format(category?.updated_at, "yyyy-MM-dd")}
                                        </TableCell>

                                        <TableCell className={""}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild >
                                                    <Button variant="ghost" size="icon" disabled={deletingId === category.id} className="size-8">
                                                        <MoreHorizontalIcon />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setUpdateCategory(category);
                                                        setNewCategory(category.name);
                                                        setIsEditModalOpen(true);
                                                    }}>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => {
                                                        if (confirm("Are you sure, you want to delete this expense")) {
                                                            handleDelete(category.id)
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
                </CardContent>
            </Card>

        </div >
    )
}

const metadata = {
    title: "Manage Categories"
}
