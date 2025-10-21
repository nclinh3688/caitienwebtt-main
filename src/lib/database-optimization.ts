/**
 * Database optimization utilities
 */

import { PrismaClient } from '@prisma/client';

export class DatabaseOptimizer {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Optimized user query with select only needed fields
   */
  async getUserOptimized(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        userStats: {
          select: {
            totalXP: true,
            currentLevel: true,
            currentStreak: true,
            totalStudyTime: true,
          }
        }
      }
    });
  }

  /**
   * Batch load user progress to avoid N+1 queries
   */
  async getUserProgressBatch(userIds: string[]) {
    return this.prisma.userProgress.findMany({
      where: {
        userId: { in: userIds }
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            difficulty: true
          }
        }
      }
    });
  }

  /**
   * Optimized lesson query with pagination
   */
  async getLessonsOptimized(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    return this.prisma.lesson.findMany({
      skip,
      take: limit,
      where: {
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        duration: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            language: true,
            level: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get user achievements with pagination
   */
  async getUserAchievements(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    return this.prisma.achievement.findMany({
      where: { userId },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        unlocked: true,
        unlockedAt: true,
        progress: true,
        maxProgress: true
      },
      orderBy: [
        { unlocked: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Get leaderboard with optimized query
   */
  async getLeaderboard(limit: number = 50) {
    return this.prisma.userStats.findMany({
      take: limit,
      select: {
        userId: true,
        totalXP: true,
        currentLevel: true,
        currentStreak: true,
        totalStudyTime: true,
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        totalXP: 'desc'
      }
    });
  }

  /**
   * Batch create user progress to avoid multiple queries
   */
  async createUserProgressBatch(progressData: Array<{
    userId: string;
    lessonId: string;
    isCompleted: boolean;
    timeSpent?: number;
    score?: number;
  }>) {
    return this.prisma.userProgress.createMany({
      data: progressData,
      skipDuplicates: true
    });
  }
}

// Database connection optimization
export function createOptimizedPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
}
