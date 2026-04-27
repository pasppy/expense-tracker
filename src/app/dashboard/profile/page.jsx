"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {

    const { user, userDp, getUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedName, setUpdatedName] = useState("");
    const [prevName, setPrevName] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        setPrevName(user?.user_metadata?.name)
        setUpdatedName(prevName);
    }, [user])

    const editHandler = async () => {
        try {
            setIsUpdating(true);

            if (!updatedName) {
                setIsUpdating(false);
                throw new Error("Name can't be empty");
            }

            let pathName = null;

            if (profilePic) {
                const allowedExt = ["jpeg", "jpg", "png", "webp"]
                const ext = profilePic?.name.split(".").pop();

                if (!allowedExt.includes(ext)) {
                    throw new Error("Invalid file type");
                }
                // generate signed url
                const res = await fetch(`/api/file-url?ext=${ext}`);
                const { path, signedUrl } = await res.json();
                pathName = path;

                // upload to storage using signed url
                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: profilePic,  // file from the user taken from input
                    headers: {
                        "Content-Type": profilePic.type
                    }
                })

                if (!uploadRes.ok) {
                    throw new Error("Avatar upload failed");
                }
            }

            const payload = {
                name: updatedName,
                path: pathName
            }

            const res = await fetch(`/api/user`, {
                method: "PATCH",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            // on success
            getUser();
            toast.success(data.message, { position: "top-right" });

            setProfilePic(null);
            setIsEditModalOpen(false);
            setIsUpdating(false);

        } catch (error) {
            console.log(error.message);
            toast.error(error.message, { position: "top-right" });
        }
    }

    return (
        <div className="w-full mx-auto max-w-250 mt-12">
            {/* edit modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                setProfilePic(null);
                setUpdatedName(prevName);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    {/* name */}
                    <div className="space-y-4">
                        <div className="">
                            <Label htmlFor="profile-pic" className={"ml-3 text-sm text-muted-foreground"}>Profile Pic</Label>

                            <div className="flex gap-2 items-center">
                                <Input
                                    id="profile-pic"
                                    type={"file"}
                                    ref={fileInputRef}
                                    accept={"image/*"}
                                    onChange={(e) => setProfilePic(e.target.files[0])}
                                />
                                <Button onClick={() => {
                                    fileInputRef.current.value = ""
                                    setProfilePic(null)
                                }}  >Clear</Button>
                            </div>
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
                                setIsEditModalOpen(false);
                                setProfilePic(null);
                                setUpdatedName(prevName);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={editHandler}
                            variant=""
                            disabled={isUpdating || (updatedName == prevName && !profilePic)}
                            className={"bg-yellow-600"}
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

