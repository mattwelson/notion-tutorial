import Image from "next/image";

export function Heroes() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
          <Image
            src="/documents.png"
            fill
            className="object-contain dark:hidden"
            alt="Jotion Documents"
          />
          <Image
            src="/documents-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="Jotion Documents"
          />
        </div>
        <div className="relative w-96 h-96 hidden md:block">
          <Image
            src="/reading.png"
            fill
            className="object-contain dark:hidden"
            alt="Jotion Reading"
          />
          <Image
            src="/reading-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="Jotion Reading"
          />
        </div>
      </div>
    </div>
  );
}
