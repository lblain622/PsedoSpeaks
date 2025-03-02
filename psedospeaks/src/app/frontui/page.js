
import {Textarea} from "@heroui/react";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/react";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">App Functionality</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Pseudo Code Editor</h2>
        </CardHeader>
        <CardBody>
          <Textarea
            className="w-full h-48"
            description="Pseudo code open editor."
            label="Description"
            placeholder="Enter your description"
            variant="faded"
            size="lg"
          />
        </CardBody>
        <CardFooter>
          <p>Start writing your pseudo code here!</p>
        </CardFooter>
      </Card>
    </div>
  );
}

