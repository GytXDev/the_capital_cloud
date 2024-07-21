import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="/logo.svg" alt="logo" height={35} width={35} />
                <p className="font-semibold text-white text-xl ml-2.5">
                    TheCapitalCloud{' '}
                    <Badge
                        variant="primary"
                        className="text-xs font-medium px-2 py-1.5 text-white">
                        v1.0.1
                    </Badge>
                </p>
            </div>
        </Link>
    );
};

export default HeaderLogo;
