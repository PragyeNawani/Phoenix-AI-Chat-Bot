"use client"
import React from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";

function NavLink({ href, children, activeClassName,className, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} {...props}>
      <span className={isActive ? className :''}>{children}</span>
    </Link>
  );
}

export default NavLink
