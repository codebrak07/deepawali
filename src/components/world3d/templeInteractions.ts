import * as THREE from "three";

export interface TempleInteractionState {
  isPerformingAarti: boolean;
  hasOfferedFlowers: boolean;
  hasOfferedBilva: boolean;
  hasRungBell: boolean;
  isBlessed: boolean;
}

export class TempleInteractionManager {
  private state: TempleInteractionState = {
    isPerformingAarti: false,
    hasOfferedFlowers: false,
    hasOfferedBilva: false,
    hasRungBell: false,
    isBlessed: false,
  };

  public performShivaAarti(
    onAartiTick?: (intensity: number) => void
  ): Promise<void> {
    this.state.isPerformingAarti = true;
    return new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const intensity = 3.5 + Math.sin(step * 0.4) * 2.0;
        onAartiTick?.(intensity);
        if (step >= 18) {
          clearInterval(interval);
          this.state.isPerformingAarti = false;
          resolve();
        }
      }, 120);
    });
  }

  public ringBellWithSound(): void {
    this.state.hasRungBell = true;
  }

  public offerFlowers(): void {
    this.state.hasOfferedFlowers = true;
  }

  public offerBilvaLeaves(): void {
    this.state.hasOfferedBilva = true;
  }

  public seekHanumanBlessings(): void {
    this.state.isBlessed = true;
  }

  public getState(): TempleInteractionState {
    return { ...this.state };
  }
}

export const templeInteractions = new TempleInteractionManager();

