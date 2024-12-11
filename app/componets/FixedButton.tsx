import Link from "next/link";

export default function FixedButton(){
    return(
        <Link href={'./'} className="fixed bottom-5 right-5 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 focus:outline-none">
        Back
        </Link>
    )
}