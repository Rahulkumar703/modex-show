export const validate = (target, schema) => {
    return (req, res, next) => {
        try {
            const data = req[target] ?? {};
            const parsedData = schema.parse(data);
            req[target] = parsedData;

            next();
        } catch (err) {
            console.error("Validation error:", err.message);

            if (err.issues) {
                return res.status(400).json({
                    status: "error", errors: err.issues.map(e => ({
                        path: e.path.join("."), message: e.message,
                    })),
                });
            }

            return res.status(500).json({
                status: "error", message: "Internal Server Error",
            });
        }
    };
};
