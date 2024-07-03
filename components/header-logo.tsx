import Link from "next/link"
import Image from "next/image"

const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="/logo.svg" alt="logo" height={35} width={35} />
                <p className="font-semibold text-white text-xl ml-2.5">
                    TheCapitalCloud{' '}
                    <span className="font-normal text-sm">v1.0.1</span>
                </p>
            </div>
        </Link>
    );
};

export default HeaderLogo;
