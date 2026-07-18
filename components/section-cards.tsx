"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function SectionCards() {
  const { getToken } = useAuth();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const [revenue, setRevenue] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRevenue(data.dashboardData.revenue);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      {/* Total Revenue */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>

          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {currency}
            {revenue.toLocaleString()}
          </CardTitle>

          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Trending up this month <TrendingUpIcon className='size-4' />
          </div>

          <div className='text-muted-foreground'>
            Revenue from completed orders
          </div>
        </CardFooter>
      </Card>

      {/* New Customers - HARD CODED */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>

          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            1,234
          </CardTitle>

          <CardAction>
            <Badge variant='outline'>
              <TrendingDownIcon />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Down 20% this period <TrendingDownIcon className='size-4' />
          </div>

          <div className='text-muted-foreground'>
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      {/* Active Accounts - HARD CODED */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>

          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            45,678
          </CardTitle>

          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Strong user retention <TrendingUpIcon className='size-4' />
          </div>

          <div className='text-muted-foreground'>Engagement exceed targets</div>
        </CardFooter>
      </Card>

      {/* Growth Rate - HARD CODED */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>

          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            4.5%
          </CardTitle>

          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Steady performance increase <TrendingUpIcon className='size-4' />
          </div>

          <div className='text-muted-foreground'>Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
