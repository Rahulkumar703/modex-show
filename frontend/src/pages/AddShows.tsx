import Page from "@/components/Page.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import ShowForm from "@/components/show-form.tsx";
import {Button} from "@/components/ui/button.tsx";

function AddShows() {
    return (
        <Page className="items-center justify-center">
            <Card className={"w-full max-w-xl"}>
                <CardHeader>
                    <CardTitle>Create new Show</CardTitle>
                    <CardDescription>
                        Add new shows to the system. Please ensure the start time is in the
                        future and all fields are filled correctly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <ShowForm/>
                </CardContent>
            </Card>
        </Page>
    );
}

export default AddShows;