"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Layout, Grid3x3, Monitor, Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WallManager({ userId }) {
  const supabase = useSupabase();
  const [walls, setWalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingWall, setEditingWall] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "videowall",
    pixel_width: 1920,
    pixel_height: 1080,
    rows: 1,
    columns: 1,
    description: ""
  });

  useEffect(() => {
    loadWalls();
  }, []);

  async function loadWalls() {
    setLoading(true);
    const { data, error } = await supabase
      .from("walls")
      .select(`
        *,
        displays:displays(count),
        screens:display_screens(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) {
      setWalls(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingWall) {
      // Update
      const { error } = await supabase
        .from("walls")
        .update(formData)
        .eq("id", editingWall.id);

      if (!error) {
        await loadWalls();
        closeDialog();
      }
    } else {
      // Create
      const { error } = await supabase
        .from("walls")
        .insert([{ ...formData, user_id: userId }]);

      if (!error) {
        await loadWalls();
        closeDialog();
      }
    }
  }

  async function handleDelete(wallId) {
    if (!confirm("Are you sure you want to delete this wall? All associated configurations will be removed.")) {
      return;
    }

    const { error } = await supabase
      .from("walls")
      .delete()
      .eq("id", wallId);

    if (!error) {
      await loadWalls();
    }
  }

  function openDialog(wall = null) {
    if (wall) {
      setEditingWall(wall);
      setFormData({
        name: wall.name,
        type: wall.type,
        pixel_width: wall.pixel_width,
        pixel_height: wall.pixel_height,
        rows: wall.rows,
        columns: wall.columns,
        description: wall.description || ""
      });
    } else {
      setEditingWall(null);
      setFormData({
        name: "",
        type: "videowall",
        pixel_width: 1920,
        pixel_height: 1080,
        rows: 1,
        columns: 1,
        description: ""
      });
    }
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
    setEditingWall(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Video Walls & LED Walls</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">Manage multi-screen configurations</p>
        </div>
        <Button onClick={() => openDialog()} className="btn-premium">
          <Plus className="w-4 h-4 mr-2" />
          Create Wall
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : walls.length === 0 ? (
        <Card className="glass-premium p-12 text-center">
          <Layout className="w-16 h-16 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">No Walls Configured</h3>
          <p className="text-muted-foreground mb-6">Create your first video wall or LED wall configuration</p>
          <Button onClick={() => openDialog()}>Create Wall</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {walls.map((wall) => (
            <Card key={wall.id} className="glass-premium p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {wall.type === "videowall" ? (
                    <Grid3x3 className="w-10 h-10 text-primary" />
                  ) : (
                    <Monitor className="w-10 h-10 text-primary" />
                  )}
                  <div>
                    <h3 className="font-black text-lg">{wall.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {wall.type === "videowall" ? "Video Wall" : "LED Wall"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="font-semibold">{wall.pixel_width}x{wall.pixel_height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="font-semibold">{wall.rows}x{wall.columns} grid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screens:</span>
                  <span className="font-semibold">{wall.rows * wall.columns} total</span>
                </div>
              </div>

              {wall.description && (
                <p className="text-xs text-muted-foreground">{wall.description}</p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDialog(wall)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(wall.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingWall ? "Edit Wall" : "Create New Wall"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold">Wall Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Lobby Wall"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Type</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border bg-background"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="videowall">Video Wall</option>
                  <option value="ledwall">LED Wall</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Canvas Width (px)</label>
                <Input
                  type="number"
                  value={formData.pixel_width}
                  onChange={(e) => setFormData({ ...formData, pixel_width: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Canvas Height (px)</label>
                <Input
                  type="number"
                  value={formData.pixel_height}
                  onChange={(e) => setFormData({ ...formData, pixel_height: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Rows</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rows}
                  onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Columns</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.columns}
                  onChange={(e) => setFormData({ ...formData, columns: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold">Description (Optional)</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes about this wall"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Preview:</p>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div>Total Screens: <span className="font-bold">{formData.rows * formData.columns}</span></div>
                  <div>Grid: <span className="font-bold">{formData.rows}x{formData.columns}</span></div>
                </div>
                <div 
                  className="grid gap-1 p-2 bg-background rounded border"
                  style={{
                    gridTemplateColumns: `repeat(${formData.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${formData.rows}, 1fr)`
                  }}
                >
                  {Array.from({ length: formData.rows * formData.columns }).map((_, i) => (
                    <div key={i} className="w-8 h-6 bg-primary/20 border border-primary/40 rounded" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 btn-premium">
                {editingWall ? "Update Wall" : "Create Wall"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}