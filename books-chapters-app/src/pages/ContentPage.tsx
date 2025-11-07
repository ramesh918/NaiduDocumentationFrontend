import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as api from '../api/contents';

// Define the expected content type
interface ChapterContent {
  content: string;
}

export default function ContentPage() {
  const { chapterId } = useParams();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [content, setContent] = useState('');

  // Fetch existing content
  const { data, isLoading, isError } = useQuery<ChapterContent>({
    queryKey: ['content', chapterId],
    queryFn: () => api.getContent(chapterId!),
    enabled: !!chapterId,
  });

  // Handle side effects after data is fetched
  useEffect(() => {
    if (data) {
      if (data.content) {
        setContent(data.content);
        setMode('preview'); // ✅ auto-switch to preview if content exists
      } else {
        setMode('edit'); // ✅ no content → start in edit mode
      }
    }
    // Only run when data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Mutation: create or update content
  const saveMutation = useMutation({
    mutationFn: (payload: { chapterId: string; content: string }) =>
      api.saveContent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', chapterId] });
      alert('Content saved successfully ✅');
      setMode('preview');
    },
    onError: () => alert('Failed to save content ❌'),
  });

  if (isLoading)
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Failed to load content
      </Alert>
    );

  return (
    <Box sx={{ maxWidth: 900, margin: '40px auto', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Chapter Content
      </Typography>

      {/* Toolbar */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && setMode(newMode)}
          size="small"
        >
          <ToggleButton value="edit">Edit</ToggleButton>
          <ToggleButton value="preview">Preview</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={() => saveMutation.mutate({ chapterId: chapterId!, content })}
          disabled={saveMutation.isPending || !content.trim()}
        >
          {saveMutation.isPending ? 'Saving...' : data?.content ? 'Update' : 'Add'}
        </Button>
      </Box>

      {/* Content */}
      {mode === 'edit' ? (
        <TextField
          fullWidth
          multiline
          minRows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your markdown content here..."
          sx={{
            fontFamily: 'monospace',
            backgroundColor: '#fafafa',
            borderRadius: 2,
          }}
        />
      ) : content ? (
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#fff',
            minHeight: '400px',
            textAlign: 'left',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            mt: 5,
            p: 4,
            border: '2px dashed #ccc',
            borderRadius: 3,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No content yet for this chapter
          </Typography>
          <Button variant="contained" onClick={() => setMode('edit')}>
            ➕ Add Content
          </Button>
        </Box>
      )}
    </Box>
  );
}
