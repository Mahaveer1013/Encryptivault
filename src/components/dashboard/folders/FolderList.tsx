import { FolderIcon } from '@heroicons/react/24/outline';
import FolderCard from './FolderCard';
import { Folder } from 'types';

export default function FolderList({ folders }: { folders: Folder[] }) {

    return (
        <>
            {!folders || folders.length == 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FolderIcon className="h-12 w-12 text-blue-200 mb-4" />
                    <div className="text-gray-400 text-lg">No folders found. Create your first folder!</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {folders && folders.map((folder) => (
                        <FolderCard key={folder._id} folder={folder} />
                    ))}
                </div>
            )}
        </>
    );
}
