import WeeklyProgress from "../../models/immature/ProgressMingguanPICAModel.js";

export const saveProgress = async (req, res) => {
  try {
    // Pastikan untuk menggunakan express.json() middleware
    const { project_id, week_number, start_date, end_date, progress_percentage, image_data } = req.body;

    // Validasi field wajib
    if (!project_id || !week_number || !start_date || !end_date || progress_percentage === undefined || image_data === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Tidak perlu parsing image_data karena sudah berupa array
    const images = image_data || [];

    // Check if record exists
    const existingRecord = await WeeklyProgress.findOne({
      where: {
        project_id,
        week_number,
      },
    });

    let result;
    if (existingRecord) {
      // Update existing record
      result = await existingRecord.update({
        start_date,
        end_date,
        progress_percentage,
        images,
      });
    } else {
      // Create new record
      result = await WeeklyProgress.create({
        project_id,
        week_number,
        start_date,
        end_date,
        progress_percentage,
        images,
      });
    }

    res.status(200).json({
      message: existingRecord ? 'Progress updated successfully' : 'Progress created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const progressRecords = await WeeklyProgress.findAll({
      where: { project_id: id },
      order: [['week_number', 'ASC']],
    });

    res.status(200).json(progressRecords);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};