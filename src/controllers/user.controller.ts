import { Request, Response } from "express";
import prisma from "../client";
import { querySchema, userStatsQuerySchema } from "../schemas/user.schema";

// Creating a user
export async function createUser(req: Request, res: Response) {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });

    res.status(201).json({
      status: true,
      message: "User Successfully Created",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "server error",
    });
  }
}

// Get all Users
export async function getUsers(req: Request, res: Response) {
  try {
    // Validate the query parameters
    const query = querySchema.parse(req.query);

    const { page, limit, sort, order } = query;

    // Calculate pagination offsets
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      }
    });

    // Fetch total count for pagination metadata
    const totalUsers = await prisma.user.count();

    res.json({
      status: true,
      message: "Users Successfully fetched",
      data: users,
      meta: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "server error",
    });
  }
}

// Get a single user
export async function getUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    res.json({
      status: true,
      message: "User Successfully fetched",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "server error",
    });
  }
}

// updating a single user
export async function updateUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
     res.status(404).json({
        status: false,
        message: "User not found",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: req.body,
    });

    res.json({
      status: true,
      message: "User Successfully updated",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "server error",
    });
  }
}

// deleting a user
export async function deleteUser(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
       res.status(404).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    await prisma.user.delete({
      where: {
        id: userId,
      },
    }),
      res.json({
        status: true,
        message: "User Successfully deleted",
      });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "server error",
    });
  }
}

export async function getUserStats(req: Request, res: Response) {
  try {
    // Validate the query parameters
    const validatedQuery = userStatsQuerySchema.parse(req.query);

    // Extract validated values
    const { minAge, maxAge, city } = validatedQuery;

    // Build the aggregation pipeline
    const pipeline: any[] = [
      // Match users based on filters
      {
        $match: {
          ...(minAge && { age: { $gte: parseInt(minAge as string, 10) } }),
          ...(maxAge && { age: { $lte: parseInt(maxAge as string, 10) } }),
          ...(city && { city: { $regex: city, $options: "i" } }), // case-insensitive
        },
      },
      // Group by city and calculate average age
      {
        $group: {
          _id: "$city", // Group by city
          averageAge: { $avg: "$age" }, // Calculate average age
          totalUsers: { $sum: 1 }, // Count total users
        },
      },
      // Rename _id to cityName
      {
        $project: {
          cityName: "$_id", // Rename _id to cityName
          averageAge: 1, // Include averageAge
          totalUsers: 1, // Include totalUsers
          _id: 0, // Exclude _id from final output
        },
      },
      // Sort results by average age in descending order
      {
        $sort: { averageAge: -1 },
      },
    ];

    // Run the aggregation pipeline using Prisma's raw query method
    const result:any = await prisma.$runCommandRaw({
      aggregate: "User", // MongoDB collection name
      pipeline,
      cursor: {},
    });

    // Return the aggregation results
    res.json({
      status: true,
      message: "User statistics fetched successfully",
      data: result.cursor?.firstBatch, // Extract results from MongoDB response
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
}
