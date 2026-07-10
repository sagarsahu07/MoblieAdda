const prisma = require('../config/db');

const getActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity logs.',
    });
  }
};

module.exports = {
  getActivityLogs,
};
