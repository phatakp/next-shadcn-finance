"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { constants } from "@/lib/config/constants";
import { TAccountType } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  type: TAccountType;
};

export function AcctTypeCarousel({ type }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    router.push(`/accounts?type=${constants.acctTypes[current - 1]}`);
  }, [current, router]);

  return (
    <Carousel
      className="md:max-w-xl max-w-28 mx-auto my-4 md:mr-auto"
      setApi={setApi}
      opts={{
        align: "center",
        loop: true,
      }}
    >
      <CarouselContent className="bg-muted p-1 text-muted-foreground">
        {constants.acctTypes.map((typ) => (
          <CarouselItem key={typ} className="md:basis-1/5 pl-4">
            <Button
              className="capitalize text-sm w-24"
              variant={type === typ ? "default" : "ghost"}
              size={"sm"}
              onClick={() => router.push(`/accounts?type=${typ}`)}
            >
              {typ}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="md:hidden" />
      <CarouselNext className="md:hidden" />
    </Carousel>
  );
}
