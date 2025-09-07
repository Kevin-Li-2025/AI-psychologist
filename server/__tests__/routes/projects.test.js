const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const projectRoutes = require('../../routes/projects');

const app = express();
app.use(express.json());
app.use('/api/projects', projectRoutes);

// Mock workspace directory for tests
const testWorkspaceDir = path.join(__dirname, '../temp-workspace');

describe('Project Routes', () => {
  beforeAll(async () => {
    await fs.ensureDir(testWorkspaceDir);
  });

  afterAll(async () => {
    await fs.remove(testWorkspaceDir);
  });

  describe('GET /api/projects', () => {
    test('should return projects list', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBe(true);
    });
  });

  describe('POST /api/projects', () => {
    test('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        techStack: 'nodejs'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.name).toBe(projectData.name);
    });

    test('should fail without required name', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ description: 'No name' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});
