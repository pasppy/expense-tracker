"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {

    const { user, userDp, getUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedName, setUpdatedName] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        setUpdatedName(user?.user_metadata?.name)
    }, [user])

    const editHandler = async () => {
        setIsUpdating(true);

        if (!updatedName) {
            toast.warning("name can't be empty.", { position: "top-right" })
            setIsUpdating(false);
            setIsEditModalOpen(false);
            setUpdatedName(user?.user_metadata?.name)
            return
        }


        const formData = new FormData();
        formData.append("name", updatedName);
        formData.append("profile_pic", profilePic);

        const res = await fetch(`/api/user`, {
            method: "PATCH",
            body: formData,
        });

        const { message, error } = await res.json();

        if (error) {
            toast.error(error, { position: "top-right" });
            setUpdatedName(user?.user_metadata?.name)
        }

        else {
            getUser();
            toast.success(message, { position: "top-right" });
        }

        // after finished executing
        setIsUpdating(false);
        setIsEditModalOpen(false);
    }

    return (
        <div className="w-full mx-auto max-w-250 mt-12">
            {/* edit modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    {/* name */}
                    <div className="space-y-4">
                        <div className="">
                            <Label htmlFor="profile-pic" className={"ml-3 text-sm text-muted-foreground"}>Profile Pic</Label>

                            <Input
                                id="profile-pic"
                                type={"file"}
                                accept={"image/*"}
                                onChange={(e) => setProfilePic(e.target.files[0])}
                            />
                        </div>

                        <div className="">
                            <Label htmlFor="name" className={"ml-3 text-sm text-muted-foreground"}>Name</Label>
                            <Input id="name"
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                required />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditModalOpen(false)
                                setUpdatedName(user?.user_metadata?.name)
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={editHandler}
                            disabled={isUpdating || (updatedName == user?.user_metadata?.name && !profilePic)}
                        >
                            {isUpdating ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <div className=" flex flex-col sm:flex-row  sm:items-end gap-8">
                <div className={"h-42 w-42 border-2 border-foreground rounded-md overflow-hidden"}>
                    <Avatar className={"rounded-md size-full"}>
                        <AvatarImage src={userDp} className={"object-cover rounded-md"} />
                        <AvatarFallback className={"rounded-md"}>{user?.user_metadata?.name.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{user?.user_metadata?.name}</h2>
                    <p> {user?.email}</p>
                    <p className="text-sm text-muted-foreground mt-4">Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
                </div>

            </div>

            <Button onClick={() => {
                setIsEditModalOpen(true);
            }} className={"mt-12 sm:mt-8"}>Edit Profile</Button>
        </div >
    )
}

