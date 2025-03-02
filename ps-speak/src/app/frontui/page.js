

export const runtime = 'edge';
export default function Dashboard() {
  return (
	  <div className="p-8">
		  <h1 className="text-2xl font-bold mb-4">App Functionality</h1>

		  <div className="bg-white shadow-md rounded-lg p-4">
			  <div className="border-b pb-4">
				  <h2 className="text-lg font-semibold">Pseudo Code Editor</h2>
			  </div>

			  <div className="py-4">
          <textarea
			  className="w-full h-48 border rounded-md p-3 text-sm"
			  placeholder="Enter your description"
		  />
			  </div>

			  <div className="pt-4">
				  <p className="text-sm text-gray-600">Start writing your pseudo code here!</p>
			  </div>
		  </div>
	  </div>
  );
}
