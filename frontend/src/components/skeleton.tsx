function Skeleton({className}: { className?: string }) {
    return (
        <section className={`bg-neutral-700 rounded-xl animate-pulse ${className || ''}`}></section>
    );
}

export default Skeleton;