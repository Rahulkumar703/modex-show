import {type HTMLAttributes} from 'react';

type Prop = HTMLAttributes<HTMLDivElement>

function Page({children, className}: Prop) {
    return (
        <div className={`flex flex-1`}>
            <div className={`flex flex-col flex-1 p-4 w-full max-w-7xl mx-auto ${className || ''}`}>
                {children}
            </div>
        </div>
    );
}

export default Page;