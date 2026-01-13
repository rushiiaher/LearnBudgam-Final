'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LiveClass, deleteLiveClass } from '../_actions/live-class-actions';
import { AddLiveClassDialog } from './live-class-dialog';
import { toast } from 'sonner';

export function LiveClassTable({
    liveClasses,
    userRole,
    userSchoolId,
    userId,
    schools
}: {
    liveClasses: LiveClass[],
    userRole: number,
    userSchoolId?: number,
    userId: number,
    schools: { id: number, name: string }[]
}) {

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to cancel this live class?')) {
            const res = await deleteLiveClass(id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }
    };

    // Permission Logic (Matches Backend)
    const canEdit = (lc: LiveClass) => {
        if (userRole === 5 || userRole === 6) return false;

        // Rule 1: Uploaded by SA (1)
        if (lc.uploaded_by_role === 1) return userRole === 1;

        // Rule 2: Uploaded by SchAdmin (2)
        if (lc.uploaded_by_role === 2) {
            if (userRole === 1) return false;
            return userRole === 2 && userSchoolId === lc.school_id;
        }

        // Rule 3: Uploaded by Teacher (4)
        if (lc.uploaded_by_role === 4) {
            // Teacher (Own)
            if (userRole === 4 && userId === lc.uploaded_by_user_id) return true;
            // Admins can override
            if (userRole === 1) return true;
            if (userRole === 2 && userSchoolId === lc.school_id) return true;
        }
        return false;
    };

    const canDelete = (lc: LiveClass) => {
        if (userRole === 5 || userRole === 6) return false;
        if (userRole === 4) return false; // Teachers NEVER delete

        if (lc.uploaded_by_role === 1) return userRole === 1;

        if (lc.uploaded_by_role === 2) {
            if (userRole === 1) return false;
            return userRole === 2 && userSchoolId === lc.school_id;
        }

        if (lc.uploaded_by_role === 4) {
            if (userRole === 1) return true;
            if (userRole === 2 && userSchoolId === lc.school_id) return true;
        }

        return false;
    };

    const getYouTubeId = (url: string) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        } catch (e) {
            return null;
        }
    };

    if (userRole === 5 || userRole === 6) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveClasses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No live classes scheduled for your class.
                    </div>
                ) : (
                    liveClasses.map((lc) => {
                        const videoId = getYouTubeId(lc.url);
                        const thumbnailUrl = videoId
                            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                            : '/placeholder-video.jpg'; // Fallback

                        return (
                            <div key={lc.id} className="group relative bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-video w-full bg-black relative">
                                    <img
                                        src={thumbnailUrl}
                                        alt={lc.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <a
                                            href={lc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        Live Class
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg line-clamp-1 mb-1">{lc.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                                        <span className="font-medium text-primary mr-2">{lc.subject_name}</span>
                                        <span>•</span>
                                        <span className="ml-2">{new Date(lc.start_time).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-xs text-muted-foreground">
                                            By {lc.uploader_name}
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={lc.url} target="_blank" rel="noopener noreferrer">
                                                Join Now
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                {/* ... existing table code ... */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Assigned To (Classes)</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        {userRole === 1 && <TableHead>School</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {liveClasses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                No live classes scheduled.
                            </TableCell>
                        </TableRow>
                    ) : (
                        liveClasses.map((lc) => (
                            <TableRow key={lc.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{lc.title}</span>
                                        <a href={lc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs flex items-center hover:underline">
                                            Join Meeting <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(lc.start_time).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[200px] truncate" title={lc.class_names}>
                                        {lc.class_names || 'None'}
                                    </div>
                                </TableCell>
                                <TableCell>{lc.subject_name}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <span className="font-semibold">{lc.uploader_name}</span>
                                        <Badge variant="outline" className="ml-2 text-[10px]">
                                            {lc.uploaded_by_role === 1 ? 'SA' :
                                                lc.uploaded_by_role === 2 ? 'Admin' : 'Teacher'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                {userRole === 1 && <TableCell>{lc.school_name}</TableCell>}
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit(lc) && (
                                            <AddLiveClassDialog
                                                liveClassToEdit={lc}
                                                schools={schools}
                                                userRole={userRole}
                                                userSchoolId={userSchoolId}
                                                trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        )}
                                        {canDelete(lc) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(lc.id)}
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
