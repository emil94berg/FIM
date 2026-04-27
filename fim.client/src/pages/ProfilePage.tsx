import { ChangeUserName } from "@/components/supabase/ChangeUserName";
import { ChangePassword } from "@/components/supabase/ChangePassword";
import { ChangeEmailAddress } from "@/components/supabase/ChangeEmailAddress";
import { ChangeProfilePicture } from "@/components/supabase/UploadProfilePicture";

export default function ProfilePage() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>

            <div className="rounded-xl border bg-card p-6 shadow-sm bg-slate-100">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Profile Picture</h2>
                <ChangeProfilePicture />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card p-6 shadow-sm bg-slate-100">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Username</h2>
                    <ChangeUserName />
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm bg-slate-100">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Email Address</h2>
                    <ChangeEmailAddress />
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm bg-slate-100 md:col-span-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Change Password</h2>
                    <ChangePassword />
                </div>
            </div>
        </div>
    )
}  