"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter, DialogHeader, DialogTitle, DialogContent, Dialog } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
        let confirmation = true;

        const expenses = await fetch(`/api/expense?category=${id}`);
        const { data } = await expenses.json();

        if (data.length > 0) {
            confirmation = confirm("All expenses under this category will get deleted. Do you want to continue?")
        }

        if (confirmation) {

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
        }

        setDeletingId(null)

    }

    useEffect(() => {
        getCategories();

    }, [])

    const addCategory = async (e) => {
        e.preventDefault();
        setAddingCategory(true)

        if (!newCategory) {
            toast.warning('Enter a category name', { position: "top-right" })
            setAddingCategory(false);
            return
        }

        const duplicateCheck = categories.filter(c => c?.name.toLowerCase() === newCategory.toLowerCase());

        if (duplicateCheck.length > 0) {
            setNewCategory("");
            setAddingCategory(false);
            toast.error(`${newCategory} category already exists.`, { position: "top-right" });
            return;
        }

        const res = await fetch("/api/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newCategory.trim()
            }),
        });

        const { message, error } = await res.json();
        if (error)
            toast.error(error, { position: "top-right" });

        else {
            getCategories();
            toast.success(message, { position: "top-right" });
        }

        setNewCategory("");
        setAddingCategory(false)
    }

    const updateCategoryHandler = async () => {
        setIsUpdating(true);

        if (!newCategory) {
            toast.warning('Enter a category name', { position: "top-right" })
            setIsUpdating(false);
            setIsEditModalOpen(false);
            setUpdateCategory({});
            return
        }

        const duplicateCheck = categories.filter(c => c?.name.toLowerCase() === newCategory.toLowerCase());

        if (duplicateCheck.length > 0) {
            setIsUpdating(false);
            setIsEditModalOpen(false);
            setUpdateCategory({});
            setNewCategory("");

            toast.error(`${newCategory} category already exists.`, { position: "top-right" });
            return;
        }

        const payload = {
            name: newCategory.trim()
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
            getCategories();
            toast.success(message, { position: "top-right" });
        }

        // after finished executing
        setIsUpdating(false);
        setIsEditModalOpen(false);
        setUpdateCategory({});
        setNewCategory("");
    }



    return (
        <div>
            {/* edit modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                setNewCategory("")
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
                                setNewCategory("")
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

            {/* add category */}
            <Card className={"w-full mx-auto max-w-250"}>


                <CardHeader>
                    <CardTitle>Add Category</CardTitle>
                    {/* <CardDescription>
                        Add your expense
                    </CardDescription> */}
                </CardHeader>
                <form onSubmit={addCategory} noValidate>
                    <CardContent>

                        {/* amount */}
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="amount">Category Name</Label>
                            </div>
                            <Input id="amount"
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add category"
                                required />
                        </div>

                    </CardContent>
                    <CardFooter className=" mt-8">
                        <Button type="submit" className="" disabled={addingCategory}>
                            {addingCategory ? "Adding.." : "Add"}
                        </Button>
                    </CardFooter>

                </form>

            </Card>

            {/* category list */}
            <Card className="w-full mx-auto max-w-250 mt-4">
                <CardHeader className={"flex justify-between items-center"}>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className={"max-w-[calc(100dvw-2.2rem)]"}>
                    <div className="w-full overflow-x-auto">
                        {categories.length > 0 ?
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

                                            <TableCell className={"text-right"}>
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
                                                            handleDelete(category.id)
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
                            : <p className="text-sm text-muted-foreground">Category not added yet.</p>
                        }
                    </div>
                </CardContent>
            </Card>

        </div >
    )
}

const metadata = {
    title: "Manage Categories"
}
