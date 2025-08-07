import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Clock, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const stakingPools = [
  {
    id: 1,
    name: "High-Yield Pool",
    apy: "15%",
    risk: "Medium",
    description: "Diversified portfolio of premium properties",
    minStake: 1000,
    totalStaked: 2500000,
    poolLimit: 5000000,
    lockPeriod: "90 days"
  },
  {
    id: 2,
    name: "Stable Income Pool",
    apy: "8%",
    risk: "Low",
    description: "Conservative mix of established properties",
    minStake: 500,
    totalStaked: 1800000,
    poolLimit: 3000000,
    lockPeriod: "30 days"
  },
  {
    id: 3,
    name: "Growth Pool",
    apy: "20%",
    risk: "High",
    description: "New developments with high growth potential",
    minStake: 2000,
    totalStaked: 800000,
    poolLimit: 2000000,
    lockPeriod: "180 days"
  }
];

export const SimpleStaking = () => {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0]);
  const [stakeAmount, setStakeAmount] = useState(selectedPool.minStake);

  const handleStake = () => {
    console.log('Stake clicked', { amount: stakeAmount, pool: selectedPool.name });
    toast({ title: 'Stake successful', description: `Successfully staked $${stakeAmount.toLocaleString()} in ${selectedPool.name}!` });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "High": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const poolProgress = (selectedPool.totalStaked / selectedPool.poolLimit) * 100;
  const expectedYearlyReturn = (stakeAmount * parseFloat(selectedPool.apy)) / 100;
  const expectedMonthlyReturn = expectedYearlyReturn / 12;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Stake & Earn Passive Income</h2>
        <p className="text-muted-foreground">Put your money to work and earn consistent returns</p>
      </div>

      {/* Pool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stakingPools.map((pool) => (
          <Card 
            key={pool.id}
            className={`cursor-pointer transition-all ${
              selectedPool.id === pool.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedPool(pool);
              setStakeAmount(pool.minStake);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{pool.name}</CardTitle>
                <Badge className={getRiskColor(pool.risk)}>{pool.risk}</Badge>
              </div>
              <div className="text-3xl font-bold text-primary">{pool.apy}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{pool.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pool Capacity</span>
                  <span>{Math.round((pool.totalStaked / pool.poolLimit) * 100)}%</span>
                </div>
                <Progress value={(pool.totalStaked / pool.poolLimit) * 100} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span>Min. Stake:</span>
                <span className="font-medium">${pool.minStake.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Lock Period:</span>
                <span className="font-medium">{pool.lockPeriod}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staking Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Stake in {selectedPool.name}
          </CardTitle>
          <CardDescription>
            Start earning {selectedPool.apy} APY on your investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Stake Amount (USD)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={selectedPool.minStake}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="flex-1 px-3 py-2 border rounded-md text-lg"
                placeholder={`Min. $${selectedPool.minStake.toLocaleString()}`}
              />
              <Button 
                variant="outline" 
                onClick={() => setStakeAmount(selectedPool.minStake)}
              >
                Min
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setStakeAmount(10000)}
              >
                $10K
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                Monthly Return
              </div>
              <div className="text-lg font-bold text-green-600">
                ${expectedMonthlyReturn.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-3 w-3" />
                Yearly Return
              </div>
              <div className="text-lg font-bold text-green-600">
                ${expectedYearlyReturn.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                Lock Period
              </div>
              <div className="text-lg font-bold">
                {selectedPool.lockPeriod}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleStake} 
            className="w-full" 
            size="lg"
            disabled={stakeAmount < selectedPool.minStake}
          >
            Stake ${stakeAmount.toLocaleString()} and Start Earning
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your funds will be locked for {selectedPool.lockPeriod}. Early withdrawal may incur penalties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};