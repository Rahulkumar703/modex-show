import type {ButtonHTMLAttributes} from "react";

type Prop = ButtonHTMLAttributes<HTMLButtonElement>

function Button({children,className, ...props}:Prop) {
    return (
        <button className={`flex text-card items-center gap-2 bg-primary hover:bg-primary/80 rounded-lg p-3 cursor-pointer font-semibold justify-center px-6 ${className || ''}`} {...props}>
            {children}
        </button>
    );
}

export default Button;